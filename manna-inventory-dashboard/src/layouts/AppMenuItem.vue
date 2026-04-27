<script>
import { useLayout } from "@/layouts/composables/layout";
import { useRoute } from "vue-router";
import { Icon } from '@iconify/vue';

export default {
    components: {
        Icon,
    },
    props: {
        item: {
            type: Object,
            default: () => ({}),
        },
        index: {
            type: Number,
            default: 0,
        },
        root: {
            type: Boolean,
            default: true,
        },
        parentItemKey: {
            type: String,
            default: null,
        },
    },
    data() {
        return {
            isActiveMenu: false,
            isExpandedMenu: false,
            itemKey: null,
        };
    },
    setup() {
        const route = useRoute();
        const { layoutState, setActiveMenuItem, toggleMenu } = useLayout();
        return { route, layoutState, setActiveMenuItem, toggleMenu };
    },
    created() {
        this.itemKey = this.parentItemKey
            ? this.parentItemKey + "-" + this.index
            : String(this.index);
        this.syncActiveState();
    },
    watch: {
        "layoutState.activeMenuItem"(newVal) {
            this.syncActiveState(newVal);
        },
        "route.path"() {
            this.syncActiveState();
        },
    },
    methods: {
        syncActiveState(activeItemKey = this.layoutState.activeMenuItem) {
            const keyMatch =
                activeItemKey === this.itemKey ||
                (activeItemKey
                    ? activeItemKey.startsWith(this.itemKey + "-")
                    : false);

            const selfRouteMatch = this.checkActiveRoute(this.item);
            const childRouteMatch = this.item?.items
                ? this.hasActiveChild(this.item)
                : false;

            if (this.item?.items) {
                this.isExpandedMenu = Boolean(keyMatch || childRouteMatch);
                this.isActiveMenu = Boolean(keyMatch && !childRouteMatch);
                return;
            }

            this.isActiveMenu = Boolean(keyMatch || selfRouteMatch);
            this.isExpandedMenu = this.isActiveMenu;
        },
        hasActiveChild(item) {
            if (!item?.items?.length) {
                return false;
            }

            return item.items.some((child) => {
                if (this.checkActiveRoute(child)) {
                    return true;
                }

                return this.hasActiveChild(child);
            });
        },
        itemClick(event, item) {
            if (item.disabled) {
                event.preventDefault();
                return;
            }
            if (
                (item.to || item.url) &&
                (this.layoutState.staticMenuMobileActive ||
                    this.layoutState.overlayMenuActive)
            ) {
                this.toggleMenu();
            }
            if (item.command) {
                item.command({ originalEvent: event, item: item });
            }
            const foundItemKey = item.items
                ? this.isExpandedMenu
                    ? this.parentItemKey
                    : this.itemKey
                : this.itemKey;
            this.setActiveMenuItem(foundItemKey);
        },
        checkActiveRoute(item) {
            const a = this.route.path.split("/")[1] || "";
            const b = item?.to?.split("/")[1] || "";
            return a === b;
        },
    },
};
</script>
<template>
    <li
        :class="{
            'layout-root-menuitem': root,
            'active-menuitem': isActiveMenu,
        }"
        class="font-farro"
    >
        <a
            v-if="(!item.to || item.items) && item.visible !== false"
            :href="item.url"
            @click="itemClick($event, item, index)"
            :class="[
                item.class,
                'flex items-center px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer',
                isActiveMenu 
                    ? 'bg-primary font-bold text-white hover:bg-primary-600 hover:text-white' 
                    : 'bg-white font-normal text-black hover:bg-surface-hover hover:text-black'
            ]"
            :target="item.target"
            tabindex="0"
        >
            <Icon 
                :icon="item.icon" 
                :class="[
                    'w-5 h-5 mr-2 transition-colors duration-200',
                    isActiveMenu 
                        ? 'text-white' 
                        : 'text-primary'
                ]"
            />
            <span>{{ item.label }}</span>
            <Icon
                icon="mdi:chevron-down"
                :class="[
                    'w-4 h-4 ml-auto transition-transform duration-200',
                    isExpandedMenu ? '-rotate-180' : '',
                    isActiveMenu ? 'text-white' : 'text-primary'
                ]"
                v-if="item.items"
            />
        </a>
        <router-link
            v-if="item.to && !item.items && item.visible !== false"
            @click="itemClick($event, item, index)"
            :class="[
                item.class,
                'flex items-center px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer',
                checkActiveRoute(item) 
                    ? 'bg-primary font-bold text-white hover:bg-primary-600 hover:text-white' 
                    : 'bg-white font-normal text-black hover:bg-surface-hover hover:text-black'
            ]"
            tabindex="0"
            :to="item.to"
        >
            <Icon
                :icon="item.icon"
                :class="[
                    'w-5 h-5 mr-2 transition-colors duration-200',
                    checkActiveRoute(item) 
                        ? 'text-white' 
                        : 'text-primary'
                ]"
            />
            <span>{{ item.label }}</span>
        </router-link>
        <Transition
            v-if="item.items && item.visible !== false"
            name="layout-submenu"
        >
            <ul v-show="root ? true : isExpandedMenu" class="layout-submenu ml-2 mt-1">
                <app-menu-item
                    v-for="(child, i) in item.items"
                    :key="child"
                    :index="i"
                    :item="child"
                    :parentItemKey="itemKey"
                    :root="false"
                ></app-menu-item>
            </ul>
        </Transition>
    </li>
</template>

<style lang="scss" scoped>
// No global overrides - all styling via Tailwind
</style>
