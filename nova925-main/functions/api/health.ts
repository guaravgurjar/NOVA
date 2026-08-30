export const onRequestGet = async (_context?: any) => {
  return new Response(JSON.stringify({ status: "ok" }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
