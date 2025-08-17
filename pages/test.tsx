import { GetStaticProps } from 'next';

// Define types for the data modules
interface CategoriesModule {
  categories?: any[];
  default?: any[];
}

interface ToolsModule {
  tools?: any[];
  default?: any[];
}

interface TestPageProps {
  categories: any[];
  tools: any[];
  error?: string;
  importError?: string;
  loadedAt?: string;
}

export default function TestPage({ categories = [], tools = [], error, importError, loadedAt }: TestPageProps) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Test Page</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">Error: {error}</div>}
      {importError && <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">Import Error: {importError}</div>}
      {loadedAt && <div className="text-gray-500 mb-6">Loaded at: {loadedAt}</div>}
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Categories ({categories.length})</h2>
        <pre className="bg-gray-800 p-4 rounded-lg overflow-auto max-h-96 text-gray-200">
          {categories.length > 0 
            ? JSON.stringify(categories.slice(0, 3), null, 2) + (categories.length > 3 ? '...' : '')
            : 'No categories found'}
        </pre>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Tools ({tools.length})</h2>
        <pre className="bg-gray-800 p-4 rounded-lg overflow-auto max-h-96 text-gray-200">
          {tools.length > 0 
            ? JSON.stringify(tools.slice(0, 3), null, 2) + (tools.length > 3 ? '...' : '')
            : 'No tools found'}
        </pre>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  console.log('Loading test page data...');
  
  try {
    // Dynamically import the data files
    const categoriesModule = await import('../data/categories') as CategoriesModule;
    const toolsModule = await import('../data/tools') as ToolsModule;

    // Handle both default and named exports with proper type checking
    const categories = (categoriesModule.categories || categoriesModule.default || []) as any[];
    const tools = (toolsModule.tools || toolsModule.default || []) as any[];
    
    console.log(`Loaded ${categories.length} categories and ${tools.length} tools`);
    
    return {
      props: {
        categories,
        tools,
        loadedAt: new Date().toISOString()
      }
    };
  } catch (error: unknown) {
    console.error('Error importing data files:', error);
    
    // Type guard to safely handle the error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorString = error instanceof Error ? error.toString() : String(error);
    
    return {
      props: {
        categories: [],
        tools: [],
        error: 'Failed to load data',
        importError: errorString,
        loadedAt: new Date().toISOString()
      }
    };
  }
};
