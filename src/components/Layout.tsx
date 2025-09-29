import logo from "@/assets/logo.png";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({
  children
}: LayoutProps) {
  const handleLogout = () => {
    console.log("Logout clicked");
  };
  
  return (
    <div className="flex min-h-screen w-full bg-white">
      <div className="flex-1 flex flex-col">
        {/* Super Simple Header */}
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-4 bg-white">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Up & Down Lift" className="h-8 w-8 object-contain" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Up & Down Lift</h1>
              <p className="text-xs text-gray-500">Sistema de Gestión de Maquinas</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm bg-gray-100 px-2 py-1 rounded">Usuario</span>
            <button 
              onClick={handleLogout}
              className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded border flex items-center gap-1"
            >
              ⚡ Cerrar Sesión
            </button>
          </div>
        </header>

        {/* Main Content - Replacing children temporarily */}
        <main className="flex-1 overflow-auto p-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Diagnóstico de React</h2>
              <div className="text-gray-600 space-y-2">
                <p>✅ Layout básico funcionando</p>
                <p>🔍 React hooks están fallando sistemáticamente</p>
                <p>⚠️ Posible problema: Múltiples instancias de React o configuración de build</p>
                <p>🎯 Siguiente paso: Verificar configuración de React</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}