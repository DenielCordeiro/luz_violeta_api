import Newsletter from '../models/Newsletter';

class NewsletterControlle {
  async news(req, res) {
    const {
      firstImage: {
        firstImageUrl,
        firstProductId,
      },
      secondImage: {
        secondImageUrl,
        secondProductId,
      },
    } = req.body;

    const news = await Newsletter.updateOne({
      news: {
        firstImage: {
          image: firstImageUrl,
          productId: firstProductId,
        },
        secondImage: {
          image: secondImageUrl,
          productId: secondProductId,
        },
      },
    });

    return res.json(news);
  }
}

export default new NewsletterControlle();
