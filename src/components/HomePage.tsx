import Form from "./Form";
import Header from "./Header";

function HomePage() {
  return (
    <div className="min-h-screen p-2 flex flex-col items-center relative">
      <Header />
      <Form />
    </div>
  );
}

export default HomePage;
