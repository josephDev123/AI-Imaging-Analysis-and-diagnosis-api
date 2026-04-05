import { tool, type ToolRuntime } from "langchain";
import z from "zod";

type RunTimeConfig = ToolRuntime<unknown, { email: string }>;

export const getMedicalReferenceCitationLink = tool(
  async (input: { diagnosis: string }, _: RunTimeConfig) => {
    const query = encodeURIComponent(input.diagnosis);

    const res = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${query}+AND+review[pt]&retmode=json&retmax=5`,
    );

    const data = await res.json();

    const ids = data.esearchresult.idlist.slice(0, 5);

    const links = ids.map(
      (id: string) => `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
    );

    return {
      references: links,
    };
  },
  {
    name: "getMedicalReferenceCitationLink",
    description: "Fetch real PubMed references for a diagnosis",
    schema: z.object({
      diagnosis: z.string(),
    }),
  },
);
