import { GetStaticProps } from 'next';

export default function TestPage({ categories, tools }: { categories: any[], tools: any[] }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Test Page</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Categories ({categories?.length || 0})</h2>
        <pre className="bg-gray-800 p-4 rounded-lg overflow-auto max-h-96">
          {JSON.stringify(categories?.slice(0, 3), null, 2)}...
        </pre>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Tools ({tools?.length || 0})</h2>
        <pre className="bg-gray-800 p-4 rounded-lg overflow-auto max-h-96">
          {JSON.stringify(tools?.slice(0, 3), null, 2)}...
        </pre>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  console.log('Loading test page data...');
  
  try {
    // Try both default and named exports
    let categoriesModule, toolsModule;
    
    try {
      categoriesModule = await import('../data/categories');
      toolsModule = await import('../data/tools');
    } catch (importError) {
      console.error('Error importing data files:', importError);
      return {
        props: {
          categories: [],
          tools: [],
          error: 'Failed to import data files',
          importError: importError.toString()
        }
      };
    }

    const categories = categoriesModule.categories || categoriesModule.default || [];
    const tools = toolsModule.tools || toolsModule.default || [];
    
    console.log(`Loaded ${categories.length} categories and ${tools.length} tools`);
    
    return {
      props: {
        categories,
        tools,
        loadedAt: new Date().toISOString()
      },
      revalidate: 10 // Revalidate every 10 seconds for testing
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        categories: [],
        tools: [],
        error: error.toString()
      },
      revalidate: 10
    };
  }
};
