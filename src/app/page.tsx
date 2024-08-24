import IdeaForm from "../components/IdeaForm";
import IdeasList from "../components/IdeasList";

export default function Home() {
  return (
    <>
      <div className="row justify-content-center">
        <div className="col-lg-8" style={{ textAlign: "center" }}>
          <h1>IDEA DISCARD PILE</h1>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <IdeaForm />
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <IdeasList />
        </div>
      </div>
    </>
  );
}
