import express from 'express';
import { connectDb } from './utils';
import mongoose from 'mongoose';
import { json } from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

(async () => {
    try {
        await connectDb();

            const metadataSchema = new mongoose.Schema({
                mintAddress: String,
                name: String,
                symbol: String,
                image: String,
                additionalMetadata: [Object],
            });

            const Metadata = mongoose.model('Metadata', metadataSchema);

            app.use(json());

            app.get("/health" , (req , res) =>
            {
                return res.sendStatus(200);
            })

            app.post('/metadata', async (req, res) => {
                const { mintAddress, name, symbol, image ,additionalMetadata } = req.body;
                  const metadata = await Metadata.findOneAndUpdate(
                    { mintAddress }, 
                    { name, symbol, image, additionalMetadata }, 
                    { new: true, upsert: true } 
                );

                return res.status(200).json(metadata);
            });

            app.get('/metadata/:mintAddress', async (req, res) => {
                const { mintAddress } = req.params;
                const response = await Metadata.findOne({ mintAddress });
              

                if (response) {

                      const metadata = {
                        name : response.name,
                        symbol : response.symbol,
                        image : response.image
                    }

                    res.json(metadata);
                } else {
                    res.status(404).send('Metadata not found');
                }
            });


        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1); // Exit the process with an error code
    }
})();
