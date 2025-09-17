import { useState } from "react";
import {
  Search,
  Phone,
  Video,
  Info,
  MoreVertical,
  CheckCheck,
  Paperclip,
  Smile,
  Image as ImageIcon,
  Mic,
  Send,
  ChevronLeft,
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
      "w-full flex items-center gap-3 py-4 p-3 text-left transition-colors hover:cursor-pointer",
      active
        ? "bg-[#EAF6FF]  border-l-4 border-l-[#74C7F2]"
        : "hover:bg-gray-50 ",
    ].join(" ")}
    aria-current={active ? "true" : undefined}
  >
    <img
      src={avatar}
      alt={name}
      className="h-10 w-10 rounded-full object-cover"
    />
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between">
        <p className="truncate text-sm font-semibold text-gray-900">{name}</p>
        <span className="shrink-0 text-xs text-gray-500">{time}</span>
      </div>
      <div className="mt-0.5 flex items-center gap-2">
        <p className="line-clamp-1 text-xs text-gray-600">{preview}</p>
        {unread > 0 ? (
          <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-500 px-1.5 text-[10px] font-semibold text-white">
            {unread}
          </span>
        ) : (
          <CheckCheck size={14} className="ml-auto text-sky-500" />
        )}
      </div>
    </div>
  </button>
);

const StatusPill = ({ color = "bg-orange-500", text = "In Progress" }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full ${color} px-2.5 py-1 text-[11px] font-semibold text-white`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
    {text}
  </span>
);

const ChatBubble = ({ side = "left", text, avatar }) => {
  const isLeft = side === "left";
  return (
    <div
      className={[
        "flex items-end gap-3",
        isLeft ? "justify-start" : "justify-end",
      ].join(" ")}
    >
      {isLeft && (
        <img
          src={avatar}
          alt="avatar"
          className="h-8 w-8 rounded-full object-cover"
        />
      )}
      <div
        className={[
          "max-w-[70%] rounded-2xl px-3.5 py-2.5 text-sm leading-5 shadow-sm",
          isLeft ? "bg-white border border-gray-200" : "bg-sky-500 text-white",
        ].join(" ")}
      >
        <p>{text}</p>
      </div>
      {!isLeft && (
        <img
          src={avatar}
          alt="avatar"
          className="h-8 w-8 rounded-full object-cover"
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

      <div className="max-w-7xl px-2 lg:px-8 mx-auto mb-5">
        <label className="relative mx-auto  block w-[1129px]">
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
        className="grid grid-cols-1 gap-4 lg:grid-cols-3 max-w-7xl px-4 md:px-8 mx-auto mb-5 min-h-[640px] lg:h-[calc(100vh-220px)]"
        role="region"
        aria-label="Chat layout"
      >
        {/* Sidebar */}
        <aside
          className={[
            "rounded-2xl border border-gray-200 bg-white shadow-sm lg:block col-span-1 flex h-full flex-col",
            showSidebar ? "block" : "hidden",
          ].join(" ")}
          aria-label="Conversations list"
        >
          <div className="flex items-center gap-3 border-b border-gray-100 p-4">
            <img
              src={ali}
              alt="Saleha Jamshed"
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Saleha Jamshed
              </p>
              <p className="text-xs text-gray-500">@saleha_123</p>
            </div>
          </div>

          <h2 className="mt-4 mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-gray-500 pl-4">
            Messages
          </h2>
          <nav className="space-y-1 flex-1 overflow-y-auto  scrollbar-thin">
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
        <section className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm col-span-2 flex h-full flex-col">
          {/* Header */}
          <header
            className="rounded-xl p-4 text-white"
            style={{
              background: "linear-gradient(180deg, #B6E0FE 0%, #74C7F2 100%)",
            }}
          >
            <div className="flex items-center justify-between">
              <h1 className="text-base font-semibold text-white">Meera</h1>
              <div className="flex items-center gap-3 text-white">
                <Phone size={18} />
                <Video size={18} />
                <Info size={18} />
                <MoreVertical size={18} />
              </div>
            </div>

            {/* Job pill */}
            <div className="mt-3 flex items-center justify-between rounded-xl bg-[#FCE7D4] px-3 py-3 text-sm">
              <div className="flex items-center gap-3">
                <StatusPill />
                <div className="text-gray-700">Kitchen Renovation</div>
                <span className="text-gray-500">725 45600</span>
              </div>
              <button className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm hover:bg-white">
                View Job
              </button>
            </div>
          </header>

          {/* Messages */}
          <div className="space-y-4 p-4 flex-1 overflow-y-auto scrollbar-thin">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold text-gray-600">
                TODAY
              </span>
            </div>

            <ChatBubble
              side="left"
              avatar={ali}
              text="Hello! I'm Ali Khan, your plumber for tomorrow's appointment. I'll be there at 9 AM as scheduled."
            />

            <div className="text-right text-[11px] text-gray-500 -mt-2 pr-14">
              3:57 PM
            </div>

            <ChatBubble
              side="right"
              avatar={meera}
              text="Perfect! Should I prepare anything before you arrive?"
            />
            <div className="text-left text-[11px] text-gray-500 -mt-2 pl-14">
              3:59 PM
            </div>
          </div>

          {/* Composer */}
          <footer className="border-t border-gray-100 p-3">
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 shadow-sm">
              <button
                className="p-2 text-gray-500 hover:text-gray-700"
                aria-label="Attach file"
              >
                <Paperclip size={18} />
              </button>
              <input
                type="text"
                placeholder="Type message.."
                className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
              />
              <button
                className="p-2 text-gray-500 hover:text-gray-700"
                aria-label="Emoji"
              >
                <Smile size={18} />
              </button>
              <button
                className="p-2 text-gray-500 hover:text-gray-700"
                aria-label="Image"
              >
                <ImageIcon size={18} />
              </button>
              <button
                className="p-2 text-gray-500 hover:text-gray-700"
                aria-label="Voice"
              >
                <Mic size={18} />
              </button>
              <button
                className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-white shadow"
                style={{
                  background:
                    "linear-gradient(180deg, #B6E0FE 0%, #74C7F2 100%)",
                }}
                aria-label="Send"
              >
                <Send size={18} />
              </button>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
};

export default Chat;
