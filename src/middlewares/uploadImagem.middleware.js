import createMulter from "../config/upload.Multer.js";
import multer from "multer";

const upload = createMulter({
    pasta: "imagens",
    tiposPermitidos: ["image/png", "image/jpeg"],
    tamanhoArquivo: 10 * 1024 * 1024 // 10MB
}).any();

const uploadImage = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            console.error('Erro no upload de imagem:', err);
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: err.message });
            }
            return res.status(400).json({ message: err.message || 'Erro no upload de imagem' });
        }

        // Normalizar para `req.file` usando o primeiro arquivo recebido (aceita nomes diferentes de campo)
        if (!req.file && req.files && req.files.length > 0) {
            req.file = req.files[0];
        }

        next();
    });
};

export default uploadImage;