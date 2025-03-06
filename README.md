# İlişki Takip Uygulaması

Bu uygulama, ilişkilerdeki "kredi" ve "güven" değerlerini takip etmenize olanak tanır. "Kredi 100'den başlar, güven 0'dan başlar" felsefesine dayanarak, ilişkilerinizde meydana gelen olayların bu değerleri nasıl etkilediğini görselleştirmenize yardımcı olur.

## Özellikler

- Kredi ve güven değerlerini görüntüleme
- Olumlu ve olumsuz olaylar ekleme
- Kredi ve güven değerlerindeki değişimleri grafik üzerinde takip etme
- Olay geçmişini görüntüleme
- İlişki verilerini sıfırlama

## Başlarken

### Gereksinimler

- Node.js 18.0.0 veya üzeri

### Kurulum

1. Projeyi klonlayın
```bash
git clone https://github.com/apo-bozdag/trustbank-relationship-tracker.git
cd trustbank-relationship-tracker
```

2. Bağımlılıkları yükleyin
```bash
npm install
```

3. Geliştirme sunucusunu başlatın
```bash
npm run dev
```

4. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin

## Kullanım

- **Yeni Olay Ekle**: Olumlu veya olumsuz bir olay eklemek için formu doldurun ve "Olay Ekle" düğmesine tıklayın.
- **Grafik**: Kredi ve güven değerlerinin zaman içindeki değişimini grafik üzerinde görüntüleyin.
- **Olay Geçmişi**: Geçmiş olayları tarihe göre sıralanmış şekilde görüntüleyin.
- **Sıfırla**: İlişki verilerini sıfırlamak için "Sıfırla" düğmesine tıklayın.

## Teknolojiler

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/)
- [date-fns](https://date-fns.org/)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
