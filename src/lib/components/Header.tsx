import {FC} from "hono/jsx";

export const Header: FC = () => (
  <nav class="bg-gray-800">
    <div class="max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <a
                href="/"
                class="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                aria-current="page"
              >
                Containers
              </a>
              <a
                href="/registries"
                class="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                aria-current="page"
              >
                Registries
              </a>
            </div>
          </div>
        </div>

        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden"></div>
      </div>
    </div>
  </nav>
);
