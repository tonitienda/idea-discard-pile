import Head from "next/head";
import IdeaForm from "../components/IdeaForm";

import IdeaFeed from "../components/IdeaFeed";

export default async function Home() {
  const data = await fetch(`${process.env.BASE_URL}/api/feed`);

  console.log("data", data);

  const json = await data.json();
  const ideas = json.items;

  console.log("ideas", ideas);

  // const addIdea = async (newIdea: Partial<Idea>): Promise<void> => {
  //   const ideaWithDetails: Idea = {
  //     ...newIdea,
  //     tags: newIdea.tags || [],
  //   } as Idea;
  //   return fetch(`${process.env.BASE_URL}/api/ideas`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(ideaWithDetails),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => fetch(`${process.env.BASE_URL}/api/ideas/${data.id}`))
  //     .then((response) => (response.ok ? response.json() : null))
  //     .then((idea) => {
  //       if (idea) {
  //         setIdeas((ideas) => [idea, ...ideas]);
  //       }
  //     });
  // };

  return (
    <div>
      <Head>
        <title>A Pile of Ideas</title>
        <meta
          name="description"
          content="Share and discover innovative ideas"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <div className="row">
          <div className="col-lg-12">
            {
              //<IdeaForm onSubmit={addIdea} />
            }
          </div>

          <div className="col-lg-12">
            <IdeaFeed ideas={ideas} />
          </div>
        </div>
      </main>
    </div>
  );
}
