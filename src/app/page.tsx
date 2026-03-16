"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { PackagesView } from "@/components/packages/packages-view";
import { CalendarView } from "@/components/calendar/calendar-view";
import { MessagesView } from "@/components/messages/messages-view";
import { BotSimulatorView } from "@/components/bot/bot-simulator-view";
import { QuotesView } from "@/components/quotes/quotes-view";
import { AppSection, MessageLead, QuoteItem } from "@/lib/types";
import { messagesMock } from "@/lib/mock-data";

export default function HomePage() {
  const [section, setSection] = useState<AppSection>("dashboard");
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [messages, setMessages] = useState<MessageLead[]>(messagesMock);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="grid min-h-[calc(100vh-2rem)] grid-cols-1 gap-6 rounded-[32px] bg-white p-4 shadow-xl md:p-6 xl:grid-cols-[280px_1fr]">
        <div className="xl:h-full">
          <AppSidebar section={section} onChangeSection={setSection} />
        </div>

        <main className="space-y-6">
          <AppHeader section={section} />

          {section === "dashboard" && <DashboardView />}
          {section === "packages" && (
            <PackagesView
              quotes={quotes}
              setQuotes={setQuotes}
              goToQuotes={() => setSection("quotes")}
            />
          )}
          {section === "quotes" && <QuotesView quotes={quotes} />}
          {section === "calendar" && <CalendarView />}
          {section === "messages" && <MessagesView messages={messages} />}
          {section === "bot" && (
            <BotSimulatorView
              quotes={quotes}
              setQuotes={setQuotes}
              messages={messages}
              setMessages={setMessages}
              goToQuotes={() => setSection("quotes")}
              goToMessages={() => setSection("messages")}
            />
          )}
        </main>
      </div>
    </div>
  );
}