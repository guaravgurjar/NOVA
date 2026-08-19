export const onRequestPost = async (context: any) => {
  const { request } = context;
  try {
    const body = await request.json();
    const orderNumber = `NOVA-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderWithId = {
      ...body,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: "pending"
    };

    return new Response(JSON.stringify({ success: true, order: orderWithId }), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: "Failed to place order" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
