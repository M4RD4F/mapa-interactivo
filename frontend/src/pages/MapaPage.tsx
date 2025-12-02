import CampusMap from '../components/CampusMap/CampusMap';
import Header from '../components/layout/Header';

export default function MapaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <CampusMap />
      </main>
    </div>
  );
}
