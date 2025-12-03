import Header from "@/components/Header";
import HealthSummary from "@/components/HealthSummary";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

const Export = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Header title="Export Summary" />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40 print:bg-white">
        <div className="flex items-center justify-between print:hidden">
          <div>
            <h1 className="text-lg font-semibold md:text-2xl">
              Your Health Summary
            </h1>
            <p className="text-sm text-muted-foreground">
              Review your summary below. You can print this page or save it as a
              PDF to share with your clinician.
            </p>
          </div>
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print or Save as PDF
          </Button>
        </div>
        <div className="flex-1">
          <HealthSummary />
        </div>
      </main>
    </>
  );
};

export default Export;