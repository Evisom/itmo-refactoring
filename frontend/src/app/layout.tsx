import "./globals.scss";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { AuthProvider } from "@/features/auth/components/AuthProvider";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/shared/utils/theme";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Container, CssBaseline } from "@mui/material";
import { Header } from "@/shared/components/Header";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
              <Suspense>
                <Header />
                <Container
                  style={{ height: "100%", paddingTop: "92px" }}
                  maxWidth="xl"
                >
                  {children}
                </Container>
              </Suspense>
            </AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
