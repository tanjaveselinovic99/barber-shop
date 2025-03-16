import Form from "./Form";
import Header from "./Header";

function HomePage() {
  return (
    <div className="min-h-screen pb-2 flex flex-col items-center justify-center relative">
      <Header />
      <Form />
    </div>
  );
}

export default HomePage;
