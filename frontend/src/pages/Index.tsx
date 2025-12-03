import HealthSummary from "@/components/HealthSummary";
import Header from "@/components/Header";

const Index = () => {
  return (
    <>
      <Header title="Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <HealthSummary />
      </main>
    </>
  );
};

export default Index;