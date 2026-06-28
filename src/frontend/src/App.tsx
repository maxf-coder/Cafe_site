import { BrowserRouter, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { I18nProvider } from "@/i18n/context"
import AppLayout from "@/components/layout/AppLayout"
import Menu from "@/pages/Menu"
import AboutUs from "@/pages/AboutUs"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Menu />} />
              <Route path="despre-noi" element={<AboutUs />} />
              {/* <Route path="evenimente" element={<Evenimente />} />
              <Route path="caritate" element={<Caritate />} /> */}
            </Route>
          </Routes>
        </BrowserRouter>
      </I18nProvider>
    </QueryClientProvider>
  )
}

export default App