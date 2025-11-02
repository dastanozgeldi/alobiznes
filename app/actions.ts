"use server";

import z from "zod";
import { generateObject } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { systemPrompt } from "./system-prompt";

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });

export async function readReceipt(initialState: unknown, formData: FormData) {
  const originalCurrency = formData.get("original_currency") as string;
  const convertedCurrency = formData.get("converted_currency") as string;
  const file = formData.get("receipt") as File;
  const fileBuffer = await file.arrayBuffer();
  const fileBase64 = Buffer.from(fileBuffer).toString("base64");
  const imageDataUrl = `data:image/jpeg;base64,${fileBase64}`;

  try {
    const { object } = await generateObject({
      model: openrouter.chat("nvidia/nemotron-nano-12b-v2-vl:free"),
      schema: z.array(
        z.object({
          date: z.string(),
          name: z.string(),
          original_price: z.string(),
          converted_price: z.number(),
          name_translation: z.string(),
          category: z.string(),
        })
      ),
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Receipt's original currency: ${originalCurrency}, currency that user wants to convert to: ${convertedCurrency}. Here's the receipt image:`,
            },
            {
              type: "image",
              image: imageDataUrl,
            },
          ],
        },
      ],
    });

    return {
      success: true,
      data: object,
    };
  } catch {
    return {
      success: false,
    };
  }
}
