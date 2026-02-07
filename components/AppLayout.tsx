import React from 'react';

// Этот компонент будет нашим новым "скелетом".
// Он принимает два специальных параметра (пропса):
// 1. sidebar - сюда мы поместим контент для левой боковой панели.
// 2. children - сюда мы поместим основной контент страницы.

const AppLayout = ({ sidebar, children }: { sidebar: React.ReactNode, children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Боковая панель (Sidebar) */}
      <aside className="w-64 flex-shrink-0 border-r border-border p-4">
        {sidebar}
      </aside>

      {/* Основная область контента */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
