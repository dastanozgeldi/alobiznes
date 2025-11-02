"use client";

import { useActionState } from "react";
import { readReceipt } from "./actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2Icon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const initialState = {
  success: false,
  data: [],
};

function getCategoryBadgeClasses(category: string): string {
  switch (category) {
    case "wants":
      return "bg-yellow-200 text-black";
    case "needs":
      return "bg-red-800 text-white";
    case "bills":
      return "bg-blue-800 text-white";
    case "groceries":
      return "bg-green-800 text-white";
    case "rare_buy":
      return "bg-amber-800 text-white";
    case "commission":
      return "bg-pink-200 text-black";
    case "eat-out":
      return "bg-purple-200 text-black";
    case "transport":
      return "bg-purple-800 text-white";
    default:
      return "";
  }
}

export default function Page() {
  const [state, formAction, isPending] = useActionState(
    readReceipt,
    initialState
  );

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="my-6 max-w-2xl mx-auto flex flex-col gap-4 w-full">
        <div>
          <h1 className="text-2xl font-bold">Ало, бизнес?</h1>
          <p className="text-muted-foreground font-medium">
            Финансовая грамотность с помощью одной фотки чека.
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1.5 w-full">
              <Label>Ориг. валюта</Label>
              <Select name="original_currency" required defaultValue="JPY">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите валюту" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JPY">Японский йен</SelectItem>
                  <SelectItem value="USD">Американский доллар</SelectItem>
                  <SelectItem value="EUR">Евро</SelectItem>
                  <SelectItem value="KZT">Казахстанский тенге</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <Label>Конвертированная валюта</Label>
              <Select name="converted_currency" required defaultValue="KZT">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите валюту" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JPY">Японский йен</SelectItem>
                  <SelectItem value="USD">Американский доллар</SelectItem>
                  <SelectItem value="EUR">Евро</SelectItem>
                  <SelectItem value="KZT">Казахстанский тенге</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="receipt">Загрузить чек (до 3MB)</Label>
            <Input
              type="file"
              name="receipt"
              id="receipt"
              accept="image/*"
              required
            />
          </div>

          <Button disabled={isPending}>
            {isPending ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Обрабатываем
              </>
            ) : (
              "Отправить"
            )}
          </Button>
        </form>

        {isPending && <Skeleton className="h-[300px] w-full" />}
        {state.success && state.data && (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>Дата</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Ориг. цена</TableHead>
                <TableHead>Конв. цена</TableHead>
                <TableHead>Категория</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.original_price}</TableCell>
                  <TableCell>{item.converted_price}</TableCell>
                  <TableCell>
                    <Badge className={getCategoryBadgeClasses(item.category)}>
                      {item.category}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
