import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(

  req: NextApiRequest,

  res: NextApiResponse

) {

  const { text } = req.body;

  const response = await fetch(

    "https://api.mymemory.translated.net/get?q=" +

      encodeURIComponent(text) +

      "&langpair=fr|en"

  );

  const data = await response.json();

  res.status(200).json({

    translation: data.responseData.translatedText,

  });
}

