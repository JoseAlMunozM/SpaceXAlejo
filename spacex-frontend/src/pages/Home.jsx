import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <h2 className="text-4xl font-bold mb-4">🚀🔥 Bienvenido 🚀🔥</h2>
      <p className="text-gray-300 text-lg">
        Este es tu panel de control donde puedes visualizar datos de SpaceX de sus lanzamientos recientes y hacerles seguimiento
      </p>
    </Layout>
  );
}
