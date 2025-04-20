import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
import { useAppSelector } from "@/hooks/useStore";
import { usePagination } from "@/hooks/usePagination";
import { useState } from "react";

interface ValidationResultProps {
  pageSize?: number;
}

export function ValidationResult({ pageSize = 50 }: ValidationResultProps) {
  const [onlyErrors, setOnlyErrors] = useState(true);

  const { validationResult, error } = useAppSelector(
    (state) => state.validation
  );
  const { currentData, currentPage, totalPages, setPage } = usePagination({
    data: onlyErrors
      ? (validationResult || []).filter((item) => item.errors)
      : validationResult || [],
    pageSize,
  });

  if (error || !validationResult) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <XCircle className="h-6 w-6 text-red-500" />
          <span className="text-lg font-semibold text-red-500">
            Validation Error
          </span>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  const hasErrors = validationResult.some((item) => item.errors);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hasErrors ? (
            <>
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
              <span className="text-lg font-semibold text-yellow-500">
                Validation completed with errors
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <span className="text-lg font-semibold text-green-500">
                Validation Successful
              </span>
            </>
          )}
        </div>
        {validationResult.length > 0 && (
          <div className="flex items-center space-x-2">
            <Switch
              id="show-errors"
              checked={onlyErrors}
              onCheckedChange={setOnlyErrors}
            />
            <Label htmlFor="show-errors">Show only errors</Label>
          </div>
        )}
      </div>

      {validationResult.length > 0 && (
        <>
          <div className="relative border rounded-lg overflow-hidden">
            <div className="max-h-[600px] overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/50">
                    {Object.keys(validationResult[0].item).map((key) => (
                      <th
                        key={key}
                        className="px-4 py-2 text-left text-sm font-medium"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="relative">
                  {currentData.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className={item.errors ? "bg-red-500/5" : undefined}
                      >
                        {Object.entries(item.item).map(([key, value]) => {
                          return (
                            <td
                              key={key}
                              className={`px-4 py-2 text-sm ${
                                item.errors?.[key]
                                  ? "font-semibold text-red-500"
                                  : ""
                              }`}
                            >
                              {item.errors?.[key] ? (
                                <HoverCard>
                                  <HoverCardTrigger className="cursor-help">
                                    <span className="border-b border-dotted border-red-500">
                                      {value?.toString() ?? ""}
                                    </span>
                                  </HoverCardTrigger>
                                  <HoverCardContent
                                    side="top"
                                    align="start"
                                    className="z-50 w-80"
                                  >
                                    <div className="space-y-2">
                                      <h4 className="font-semibold text-red-500">
                                        Validation Errors:
                                      </h4>
                                      <ul className="list-disc pl-4 space-y-1">
                                        {item.errors[key].map((error, i) => (
                                          <li
                                            key={i}
                                            className="text-sm text-red-500"
                                          >
                                            {error}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </HoverCardContent>
                                </HoverCard>
                              ) : (
                                value?.toString() ?? ""
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {validationResult.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No validation results to display
        </div>
      )}
    </div>
  );
}
