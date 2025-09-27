export default function handler(req, res) {
const prices = [
{ crop: 'Wheat', price: 2200, mandi: 'Delhi' },
{ crop: 'Rice', price: 1850, mandi: 'Punjab' },
];
res.status(200).json({ prices });
}
