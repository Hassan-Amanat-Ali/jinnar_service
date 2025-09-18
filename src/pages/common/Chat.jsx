import { useState } from "react";
import {
  Search,
  Phone,
  Video,
  CheckCheck,
  Paperclip,
  Smile,
  Send,
} from "lucide-react";

import meera from "../../assets/images/worker2.jpg";
import ali from "../../assets/images/ali-hassan.jpg";
import emily from "../../assets/images/testimonial1.jpg";
import liam from "../../assets/images/worker.jpg";
import sophia from "../../assets/images/worker3.jpg";
import max from "../../assets/images/worker4.jpg";
import Hero from "../../components/common/Hero";

const ContactItem = ({
  avatar,
  name,
  preview,
  time,
  unread = 0,
  active = false,
}) => (
  <button
    className={[
      "w-full flex items-center gap-2 md:gap-3 py-3 md:py-4 p-2 md:p-3 text-left transition-colors hover:cursor-pointer",
      active
        ? "bg-[#EAF6FF]  border-l-4 border-l-[#74C7F2]"
        : "hover:bg-gray-50 ",
    ].join(" ")}
    aria-current={active ? "true" : undefined}
  >
    <img
      src={avatar}
      alt={name}
      className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover flex-shrink-0"
    />
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between">
        <p className="truncate text-xs md:text-sm font-semibold text-gray-900">
          {name}
        </p>
        <span className="shrink-0 text-[10px] md:text-xs text-gray-500">
          {time}
        </span>
      </div>
      <div className="mt-0.5 flex items-center gap-2">
        <p className="line-clamp-1 text-[10px] md:text-xs text-gray-600">
          {preview}
        </p>
        {unread > 0 ? (
          <span className="ml-auto inline-flex h-4 min-w-4 md:h-5 md:min-w-5 items-center justify-center rounded-full bg-sky-500 px-1 md:px-1.5 text-[9px] md:text-[10px] font-semibold text-white">
            {unread}
          </span>
        ) : (
          <CheckCheck
            size={12}
            className="md:w-[14px] md:h-[14px] ml-auto text-sky-500"
          />
        )}
      </div>
    </div>
  </button>
);

const StatusPill = ({ color = "bg-orange-500", text = "In Progress" }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full ${color} px-2.5 py-1 text-[11px] font-semibold text-white`}
  >
    {text}
  </span>
);

const ChatBubble = ({ side = "left", text, avatar }) => {
  const isLeft = side === "left";
  return (
    <div
      className={[
        "flex gap-2 md:gap-3",
        isLeft ? "justify-start" : "justify-end",
      ].join(" ")}
    >
      {isLeft && (
        <img
          src={avatar}
          alt="avatar"
          className="h-6 w-6 md:h-8 md:w-8 rounded-full object-cover flex-shrink-0"
        />
      )}
      <div
        className={[
          "max-w-[85%] sm:max-w-[75%] md:max-w-[70%] rounded-lg px-3 md:px-3.5 py-2 text-xs md:text-sm leading-5 shadow-sm",
          isLeft
            ? "bg-[#EEEEEE] border border-gray-200"
            : "bg-sky-500 text-white",
        ].join(" ")}
      >
        <p className="break-words">{text}</p>
        <div
          className={`${
            isLeft ? "text-left" : "text-right text-white"
          } text-[10px] md:text-[11px] text-gray-500 mt-1 md:mt-2 `}
        >
          3:57 PM
        </div>
      </div>

      {!isLeft && (
        <img
          src={avatar}
          alt="avatar"
          className="h-6 w-6 md:h-8 md:w-8 rounded-full object-cover flex-shrink-0"
        />
      )}
    </div>
  );
};

const Chat = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <main className="">
      <Hero title="Messages" place="chat" subtitle="" />

      {/* Global search */}

      <div className="max-w-7xl px-4 md:px-8 mx-auto mb-5">
        <label className="relative mx-auto block w-full max-w-4xl">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            placeholder="Search for any service instantly..."
            className="w-full rounded-[16px] border border-gray-200 bg-neutral-100 py-3 pl-11 pr-4 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:outline-none"
          />
        </label>
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-3 max-w-7xl px-4 md:px-8 mx-auto mb-5 min-h-[640px] lg:h-[calc(100vh-220px)] gap-4 lg:gap-0"
        role="region"
        aria-label="Chat layout"
      >
        {/* Mobile toggle button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium"
          >
            {showSidebar ? "Hide" : "Show"} Conversations
          </button>
        </div>

        {/* Sidebar */}
        <aside
          className={[
            "border border-gray-200 bg-white shadow-sm lg:block col-span-1 flex h-full flex-col rounded-lg lg:rounded-r-none lg:border-r-0",
            showSidebar ? "block" : "hidden lg:block",
          ].join(" ")}
          aria-label="Conversations list"
        >
          <div className="flex items-center gap-2 md:gap-3 border-b border-gray-100 p-3 md:p-4">
            <img
              src={ali}
              alt="Saleha Jamshed"
              className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover"
            />
            <div>
              <p className="text-xs md:text-sm font-semibold text-gray-900">
                Saleha Jamshed
              </p>
              <p className="text-[10px] md:text-xs text-gray-500">
                @saleha_123
              </p>
            </div>
          </div>

          <h2 className="mt-3 md:mt-4 mb-2 px-2 md:px-1 text-[10px] md:text-xs font-semibold uppercase tracking-wide text-gray-500 pl-3 md:pl-4">
            Messages
          </h2>
          <nav className="space-y-1 flex-1 overflow-y-auto scrollbar-thin">
            <ContactItem
              avatar={emily}
              name="Emily"
              time="5m"
              preview="Great! Did you confirm the exact color of the tiles?"
              unread={2}
            />
            <ContactItem
              avatar={liam}
              name="Liam"
              time="1h"
              preview="When will the work be ready?"
            />
            <ContactItem
              avatar={meera}
              name="Meera"
              time="1h"
              preview="Awesome! I love chocolate chip cookie dough. Looking forward."
              active
            />
            <ContactItem
              avatar={sophia}
              name="Sophia"
              time="2h"
              preview="We just switched to the latest fixtures for better finish…"
            />
            <ContactItem
              avatar={max}
              name="Max"
              time="3h"
              preview="That is a good idea. I will try to communicate this with the team…"
            />
          </nav>
        </aside>

        {/* Chat panel */}
        <section className="border border-gray-200 bg-white p-2 shadow-sm col-span-1 lg:col-span-2 flex h-full flex-col rounded-lg lg:rounded-l-none lg:border-l-0">
          {/* Header */}
          <header
            className="rounded-lg p-3 md:p-4 text-white"
            style={{
              background: "linear-gradient(180deg, #B6E0FE 0%, #74C7F2 100%)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <img
                  src={meera}
                  alt="Meera"
                  className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover"
                />
                <h1 className="text-sm md:text-base font-semibold text-white">
                  Meera
                </h1>
              </div>
              <div className="flex items-center gap-2 md:gap-3 text-white">
                <Phone
                  size={20}
                  className="md:w-[22px] md:h-[22px]"
                  color="white"
                  fill="white"
                />
                <Video
                  size={20}
                  className="md:w-[22px] md:h-[22px]"
                  color="white"
                  fill="white"
                />
              </div>
            </div>
          </header>

          {/* Job pill */}
          <div className="mt-1 flex flex-col sm:flex-row sm:items-center justify-between rounded-lg bg-[#FCE7D4] px-3 py-3 text-sm gap-3 sm:gap-0">
            <div className="flex flex-col gap-1">
              <div className="text-[#9F2D00] font-bold text-sm md:text-base">
                Kitchen Renovation
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <StatusPill />
                <span className="text-gray-500 text-xs md:text-sm">
                  725 45600
                </span>
              </div>
            </div>
            <button className="rounded-full bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] px-3 md:px-4 py-2 md:py-3 cursor-pointer text-xs font-semibold text-white self-start sm:self-auto">
              View Job
            </button>
          </div>

          {/* Messages */}
          <div className="space-y-3 md:space-y-4 p-3 md:p-4 flex-1 overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-center gap-2">
              <span className="rounded-md bg-gray-100 px-2 md:px-3 py-1 md:py-2 text-[10px] md:text-[11px] font-semibold text-gray-600">
                TODAY
              </span>
            </div>

            <ChatBubble
              side="left"
              avatar={ali}
              text="Hello! I'm Ali Khan, your plumber for tomorrow's appointment. I'll be there at 9 AM as scheduled."
            />

            <ChatBubble
              side="right"
              avatar={meera}
              text="Perfect! Should I prepare anything before you arrive?"
            />
          </div>

          {/* Composer */}
          <footer className="border-t border-gray-100 p-2 md:p-3">
            <div className="flex items-center gap-1 md:gap-2 rounded-full border border-gray-200 bg-white px-2 md:px-3 py-1.5 md:py-2 shadow-sm">
              <button
                className="p-1.5 md:p-2 text-gray-500 hover:text-gray-700"
                aria-label="Attach file"
              >
                <Paperclip size={16} className="md:w-[18px] md:h-[18px]" />
              </button>
              <input
                type="text"
                placeholder="Type message.."
                className="flex-1 bg-transparent text-xs md:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none min-w-0"
              />
              <button
                className="text-gray-500 hover:text-gray-700"
                aria-label="Emoji"
              >
                <Smile size={16} className="md:w-[18px] md:h-[18px]" />
              </button>

              <button
                className="inline-flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-full text-white shadow cursor-pointer"
                style={{
                  background:
                    "linear-gradient(180deg, #B6E0FE 0%, #74C7F2 100%)",
                }}
                aria-label="Send"
              >
                <Send size={14} className="md:w-[18px] md:h-[18px]" />
              </button>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
};

export default Chat;
