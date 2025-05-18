import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Save, Plus, Copy, Search } from 'lucide-react';

// Componente principal
const CodeRepository = () => {
  // Estados para manejar los snippets y la interfaz
  const [snippets, setSnippets] = useState([]);
  const [currentCode, setCurrentCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Cargar snippets del localStorage al iniciar
  useEffect(() => {
    const savedSnippets = localStorage.getItem('codeSnippets');
    if (savedSnippets) {
      setSnippets(JSON.parse(savedSnippets));
    }

    // Detectar preferencia de tema oscuro
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  // Guardar snippets en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('codeSnippets', JSON.stringify(snippets));
  }, [snippets]);

  // Función para guardar un nuevo snippet o actualizar uno existente
  const saveSnippet = () => {
    if (!currentCode.trim() || !title.trim()) return;

    if (editingId !== null) {
      // Actualizar snippet existente
      setSnippets(snippets.map(s =>
        s.id === editingId ? { ...s, code: currentCode, title, description, language } : s
      ));
      setEditingId(null);
    } else {
      // Crear nuevo snippet
      const newSnippet = {
        id: Date.now(),
        code: currentCode,
        title,
        description,
        language,
        createdAt: new Date().toISOString()
      };
      setSnippets([newSnippet, ...snippets]);
    }

    // Limpiar formulario
    setCurrentCode('');
    setTitle('');
    setDescription('');
    setLanguage('javascript');
  };

  // Función para eliminar un snippet
  const deleteSnippet = (id) => {
    setSnippets(snippets.filter(s => s.id !== id));
  };

  // Función para editar un snippet
  const editSnippet = (snippet) => {
    setCurrentCode(snippet.code);
    setTitle(snippet.title);
    setDescription(snippet.description || '');
    setLanguage(snippet.language);
    setEditingId(snippet.id);
  };

  // Función para copiar código al portapapeles
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
  };

  // Filtrar snippets según término de búsqueda
  const filteredSnippets = snippets.filter(snippet =>
    snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    snippet.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para cambiar el tema
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mi Repositorio de Código</h1>
          <button
            onClick={toggleDarkMode}
            className={`px-3 py-1 rounded-md ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-300 text-gray-800'}`}
          >
            {darkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
          </button>
        </header>

        {/* Formulario para nuevo snippet */}
        <div className={`mb-8 p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingId !== null ? 'Editar Snippet' : 'Nuevo Snippet'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 font-medium">Título *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full p-2 border rounded-md ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                placeholder="Ej: Función para ordenar array"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Lenguaje</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`w-full p-2 border rounded-md ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
                <option value="php">PHP</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="sql">SQL</option>
                <option value="bash">Bash</option>
                <option value="other">Otro</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Descripción</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full p-2 border rounded-md ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
              placeholder="Descripción opcional del código"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Código *</label>
            <textarea
              value={currentCode}
              onChange={(e) => setCurrentCode(e.target.value)}
              className={`w-full p-2 border rounded-md font-mono text-sm h-40 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
              placeholder="Pega tu código aquí..."
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={saveSnippet}
              disabled={!currentCode.trim() || !title.trim()}
              className={`flex items-center px-4 py-2 rounded-md ${!currentCode.trim() || !title.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : darkMode
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
            >
              <Save size={18} className="mr-1" />
              {editingId !== null ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className={`relative mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} />
          </div>
          <input
            type="text"
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
              }`}
            placeholder="Buscar snippets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Lista de snippets */}
        {filteredSnippets.length === 0 ? (
          <div className={`text-center py-10 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <p className="text-lg">
              {snippets.length === 0
                ? 'No hay snippets guardados. ¡Añade uno nuevo!'
                : 'No se encontraron snippets que coincidan con tu búsqueda.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredSnippets.map(snippet => (
              <div
                key={snippet.id}
                className={`rounded-lg shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className={`p-4 flex justify-between items-center ${darkMode
                    ? snippet.language === 'javascript' ? 'bg-yellow-900' :
                      snippet.language === 'python' ? 'bg-blue-900' :
                        snippet.language === 'java' ? 'bg-orange-900' :
                          snippet.language === 'csharp' ? 'bg-green-900' : 'bg-gray-700'
                    : snippet.language === 'javascript' ? 'bg-yellow-100' :
                      snippet.language === 'python' ? 'bg-blue-100' :
                        snippet.language === 'java' ? 'bg-orange-100' :
                          snippet.language === 'csharp' ? 'bg-green-100' : 'bg-gray-100'
                  }`}
                >
                  <div>
                    <h3 className="font-bold text-lg">{snippet.title}</h3>
                    {snippet.description && (
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{snippet.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(snippet.code)}
                      className={`p-1 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                      title="Copiar código"
                    >
                      <Copy size={18} />
                    </button>
                    <button
                      onClick={() => editSnippet(snippet)}
                      className={`p-1 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                      title="Editar snippet"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteSnippet(snippet.id)}
                      className={`p-1 rounded-md ${darkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-200 text-red-500'}`}
                      title="Eliminar snippet"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <pre className={`whitespace-pre-wrap font-mono text-sm overflow-x-auto p-3 rounded-md ${darkMode ? 'bg-gray-900' : 'bg-gray-50'
                    }`}>
                    {snippet.code}
                  </pre>
                </div>

                <div className={`px-4 py-2 text-xs ${darkMode ? 'text-gray-400 border-t border-gray-700' : 'text-gray-500 border-t border-gray-200'}`}>
                  <span>{snippet.language.charAt(0).toUpperCase() + snippet.language.slice(1)} • </span>
                  <span>Creado: {new Date(snippet.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeRepository;