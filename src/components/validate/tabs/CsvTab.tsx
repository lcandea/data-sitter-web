import { useState, forwardRef, useImperativeHandle } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/useStore";
import { executeValidator } from "@/store/slices/validation";
import { useContract } from "@/hooks/useContract";
import { TabRef } from "@/lib/types";
import { usePagination } from "@/hooks/usePagination";
import { Pagination } from "@/components/ui/pagination";

export const CsvTab = forwardRef<TabRef>((_, ref) => {
  const { validateCsv } = useContract();

  const dispatch = useAppDispatch();
  const [csvData, setCsvData] = useState<Record<string, string>[]>([]);
  const [csvContent, setCsvContent] = useState<string>("");

  const { currentData, currentPage, totalPages, setPage } = usePagination({
    data: csvData,
    pageSize: 50,
  });

  useImperativeHandle(ref, () => ({
    async validate() {
      dispatch(executeValidator(() => validateCsv(csvContent)));
    },
    clear() {
      setCsvData([]);
      setCsvContent("");
    },
  }));

  const handleCsvUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const content = await file.text();
    setCsvContent(content);

    // Parse CSV to display in table
    const lines = content.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());
    const rows = lines
      .slice(1)
      .filter((line) => line.trim())
      .map((line) => {
        const values = line.split(",").map((v) => v.trim());
        return headers.reduce((obj, header, i) => {
          obj[header] = values[i];
          return obj;
        }, {} as Record<string, string>);
      });

    setCsvData(rows);
  };

  return (
    <>
      {!csvContent ? (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
          <Button variant="outline" asChild className="mb-4">
            <label className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Select CSV File
              <input
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
                className="hidden"
              />
            </label>
          </Button>
          <p className="text-sm text-muted-foreground">No CSV selected</p>
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <div className="max-h-[600px] overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/50">
                    {Object.keys(csvData[0] || {}).map((header) => (
                      <th
                        key={header}
                        className="px-4 py-2 text-left text-sm font-medium"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((value, j) => (
                        <td key={j} className="px-4 py-2 text-sm">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            className="pt-4"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </>
  );
});

CsvTab.displayName = "CsvTab";
