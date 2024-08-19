import type { Component } from 'vue';

export interface MenuItem {
    label: string;
    icon: Component;
    to: string;
}
