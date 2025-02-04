const errorController = {};

errorController.generateError = (req, res, next) => {
    try {
        throw new Error("Erro 500 intencional! 🚨"); // Gera um erro
    } catch (error) {
        next(error); // Envia o erro para o middleware de tratamento
    }
};

module.exports = errorController;
