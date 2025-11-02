"use server";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateObject } from "ai";
import z from "zod";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function readReceipt(formData: FormData) {
  const file = formData.get("receipt") as File;
  const fileBuffer = await file.arrayBuffer();
  const fileBase64 = Buffer.from(fileBuffer).toString("base64");
  const imageDataUrl = `data:image/jpeg;base64,${fileBase64}`;

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
        content: `Here's a **system prompt** that provides clear instructions for processing the receipt data. This prompt ensures that the receipt entries are translated to English where possible, currency is converted to KZT (Kazakhstani Tenge), and categories are mapped appropriately from a predefined list.

---

### System Prompt:
**Objective**: Process a receipt and extract key details, including translations, currency conversions, and categorized expenses.

---

#### **Input Information**:
- **Receipt Entries**: Each entry on the receipt includes:
  - **Name**: The item name (in Japanese or another language, if legible).
  - **Price**: The price of the item, including units or quantities.
  - **Category**: The expense category (to be determined automatically).

#### **Output Format**:
- The output should be a structured JSON array where each entry contains the following fields:
  - date: The date of the transaction (e.g., 2025-10-05).
  - name: The original name of the item as written on the receipt.
  - original_price: The original price of the item, including any currency and units (e.g., 279/2 for 279 yen per 2 units).
  - converted_price: The price converted to KZT (if possible). Use current exchange rates for conversion.
  - name_translation: An English translation of the item name, where legible.
  - category: One of the following categories:
    - wants: Non-essential items (e.g., luxury or discretionary purchases).
    - needs: Essential items (e.g., daily necessities).
    - bills: Regular recurring expenses (e.g., utilities).
    - groceries: Items from a grocery store (e.g., food, drinks, household goods).
    - rare_buy: Infrequent, higher-cost items (e.g., big purchases).
    - commission: Income payments or commissions received.
    - eat-out: Costs related to dining out (e.g., restaurants, cafes).
    - transport: Transportation-related expenses (e.g., taxis, public transport).

---

#### **Detailed Instructions**:
1. **Date Extraction**:
   - Extract the date from the receipt header and format it as YYYY-MM-DD.

2. **Entry Name Parsing**:
   - For each item name on the receipt:
     - **Legible Names**: Translate the name to English if legible. Use approximate translations if partial content is visible.
     - **Unlegible Names**: Provide a brief description or note (e.g., Item 1, Product Code X, etc.) if translation is not possible.

3. **Price Parsing**:
   - Extract the original price, including any units or quantities (e.g., 279/2 for 279 yen per 2 units). Store this in the original_price field.
   - Convert the currency to KZT (Kazakhstani Tenge) if the original currency is detectable. Use the current exchange rate for conversion. If the currency is not specified, assume it is JPY (Japanese Yen) unless otherwise indicated. Store the converted price in the converted_price field.

4. **Category Assignment**:
   - Automatically assign a category based on the item description and context. Use the following guidelines:
     - groceries: Food, beverages, household items.
     - eat-out: Items related to dining out.
     - transport: Items related to transportation.
     - wants: Discretionary or luxury items.
     - needs: Essential items (e.g., groceries, bills).
     - rare_buy: High-value or infrequent purchases.
     - commission: Income-related entries.
     - bills: Recurring expenses like utilities or subscriptions.

5. **Output Structure**:
   - Each entry should be an object with the following structure:
     {
       "date": "YYYY-MM-DD",
       "name": "Original Item Name",
       "original_price": "Price in Original Currency",
       "converted_price": "Price in KZT",
       "name_translation": "English Translation or Description",
       "category": "Category (e.g., groceries, eat-out, etc.)"
     }


6. **Edge Cases**:
   - If the currency is not specified, assume JPY (Japanese Yen) by default.
   - If the description is unclear, provide a generic category like wants or needs based on general assumptions.

---

### Example Output:
Here's an example of what the structured output might look like based on the provided receipt:
[
  {
    "date": "2025-10-05",
    "name": "*七ウ5) (袋) 0.279/斤",
    "original_price": "279/2",
    "converted_price": 4980, // Assuming JPY to KZT conversion rate
    "name_translation": "Seven U 5 (Bag) - Likely a type of fruit or vegetable",
    "category": "groceries"
  },
  {
    "date": "2025-10-05",
    "name": "*ミ二卜又卜 0.449/斤",
    "original_price": "249/2",
    "converted_price": 4230,
    "name_translation": "*Mi nito no - Likely a fresh vegetable or fruit",
    "category": "groceries"
  },
  // ... other entries ...
]

---

### Next Steps:
- Use the provided system prompt to guide the parsing and structuring of receipt data.
- Depending on the detected currency, ensure accurate conversion to KZT using real-time exchange rates.
- Update the JSON output dynamically based on new receipt data.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Here's the user receipt data:",
          },
          {
            type: "image",
            image: imageDataUrl,
          },
        ],
      },
    ],
  });

  console.log(JSON.stringify(object, null, 2));
}
