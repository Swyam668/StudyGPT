import Quiz from '../models/Quiz.js';

// get all quizzes
// GET /api/quizzes/:documentId
export const getQuizzes = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({
            userId: req.user._id,
            documentId: req.params.documentId
        })
            // projecting these fields (title and fileName) of documents selected (from document table)
          .populate('documentId', 'title fileName')
          .sort({ createdAt: -1});

        res.status(200).json({
            success: true,
            count: quizzes.length,
            data: quizzes
        });
    } catch (error) {
        next(error);
    }
};

// get a single quiz by ID
// GET /api/quizzes/quiz/:id
export const getQuizById = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if(!quiz){
            return res.status(404).json({
                success: false,
                error: 'Quiz not found',
                statusCode: 404
            });
        }

        res.status(200).json({
            success: true,
            data: quiz
        });
    } catch (error) {
        next(error);
    }
};

// submit quiz answer
// POST /api/quizzes/:id/submit
export const submitQuiz = async (req, res, next) => {
    try {
        // doing this to prevent runtime error because later we destructure properties of 'answers' (from req.body)
        const { answers } = req.body;

        if(!Array.isArray(answers)){
            return res.status(400).json({
                success: false,
                error: 'Please provide answers array',
                statusCode: 400
            });
        }

        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if(!quiz){
            return res.status(404).json({
                success: false,
                error: 'Quiz not found',
                statusCode: 404
            });
        }

        if(quiz.completedAt){
            return res.status(400).json({
                success: false,
                error: 'Quiz already completed',
                statusCode: 400
            });
        }

        // validating answers
        let correctCount = 0;
        const userAnswers = [];

        answers.forEach(answer => {
            const { questionIndex, selectedAnswer } = answer;

            if(questionIndex < quiz.questions.length){
                const question = quiz.questions[questionIndex];
                const isCorrect = selectedAnswer === question.correctAnswer;

                if(isCorrect) correctCount++;

                userAnswers.push({
                    questionIndex,
                    selectedAnswer,
                    isCorrect,
                    answeredAt: new Date()
                });
            }
        });


        const score = Math.round((correctCount / quiz.totalQuestions) * 100);

        quiz.userAnswers = userAnswers;
        quiz.score = score;
        quiz.completedAt = new Date();

        await quiz.save();

        res.status(200).json({
            success: true,
            data: {
                quizId: quiz._id,
                score,
                correctCount,
                totalQuestions: quiz.totalQuestions,
                percentage: score,
                userAnswers
            },
            message: 'Quiz submitted successfully'
        });

    } catch (error) {
        next(error);
    }
};

// get quiz result
// GET /api/quizzes/:id/results
export const getQuizResults = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        })
          .populate('documentId', 'title');
        
          if(!quiz){
            return res.status(404).json({
                success: false,
                error: 'Quiz not found',
                statusCode: 404
            });
          }

          if(!quiz.completedAt){
            return res.status(400).json({
                success: false,
                error: 'Quiz not completed yet',
                statusCode: 400
            });
          }

          const detailedResults = quiz.questions.map((question, index) => {
            const userAnswer = quiz.userAnswers.find(a => a.questionIndex === index);

            return {
                questionIndex: index,
                question: question.question,
                options: question.options,
                correctAnswer: question.correctAnswer,
                // safe optional chaining
                // if corresponding to a particular question, user did not answer 
                selectedAnswer: userAnswer?.selectedAnswer || null,
                // we dont want the variable to be boolean so use '\\'
                isCorrect: userAnswer?.isCorrect || null,
                explanation: question.explanation
            };
          });

          res.status(200).json({
            success: true,
            data: {
                quiz: {
                    id: quiz._id,
                    title: quiz.title,
                    document: quiz.documentId,
                    score: quiz.score,
                    totalQuestions: quiz.totalQuestions,
                    completedAt: quiz.completedAt
                },
                results: detailedResults
            }
          });

    } catch (error) {
        next(error);
    }
};

// Delete quiz
// DELETE /api/quizzes/:id
export const deleteQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if(!quiz){
            return res.status(404).json({
                success: false,
                error: 'Quiz not found',
                statusCode: 404
            });
          }

          await quiz.deleteOne();

          res.status(200).json({
            success: true,
            message: 'Quiz deleted successfully'
          });

    } catch (error) {
        next(error);
    }
};