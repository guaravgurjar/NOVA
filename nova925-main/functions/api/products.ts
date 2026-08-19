export const onRequestGet = async () => {
  return new Response(JSON.stringify({ success: true, products: [] }), {
    headers: {
      "Content-Type": "application/json"
    }
  });
};
