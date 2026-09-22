import express from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: 'mp-backend.env' });
import { MercadoPagoConfig, Preference } from 'mercadopago';

const app = express();
app.use(express.json());

const accessToken = process.env.MP_ACCESS_TOKEN;

if (!accessToken) {
  console.error('MP_ACCESS_TOKEN não encontrado. Verifique server/mp-backend/.env');
  process.exit(1);
}

const client = new MercadoPagoConfig({ accessToken });

app.post('/api/mp/preference', async (req, res) => {
  try {
    const items = req.body?.items;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'Payload inválido. Envie { items: [{ title, quantity, unit_price }] }',
      });
    }

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: items.map((i) => ({
          title: i.title,
          quantity: Number(i.quantity),
          unit_price: Number(i.unit_price),
        })),
      },
    });

    return res.json({ checkoutUrl: result.init_point });
  } catch (err) {
    console.error('Erro Mercado Pago ao criar preferência:', err);

    return res.status(500).json({
      message: 'Erro ao criar preferência',
      detail: err?.message || String(err),
    });
  }
});

app.listen(3000, '127.0.0.1', () => {
  console.log('MP backend rodando na porta 3000');
});
