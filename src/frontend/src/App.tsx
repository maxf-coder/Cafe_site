import Navbar from "./components/layout/Navbar"
import { BrowserRouter } from "react-router-dom"
import { I18nProvider } from "./i18n/context"

function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    </I18nProvider>
  )
}

export default App