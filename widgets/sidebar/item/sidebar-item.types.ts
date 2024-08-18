import type { Component } from 'vue';

export interface SidebarItem {
    title: string;
    to: string;
    icon: Component;
}
