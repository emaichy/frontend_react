import {
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";

import {
    MenuItemProps
} from "../interfaces/menu.interface";
import { useTheme } from "../context/ThemeContext";

export default function MenuItem({
    title,
    icon,
    onPress
}: MenuItemProps) {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
        >
            <Text style={styles.icon}>
                {icon}
            </Text>

            <Text style={[styles.title, { color: colors.text }]}>
                {title}
            </Text>

            <Text style={[styles.arrow, { color: colors.secondary }]}>
                ›
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    icon: {
        fontSize: 22,
        width: 40,
    },
    title: {
        flex: 1,
        fontSize: 16,
    },
    arrow: {
        fontSize: 24,
    },
});
