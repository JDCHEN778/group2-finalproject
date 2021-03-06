import {
    useColorMode, 
    useColorModeValue,
    Button, 
    IconButton, 
    IconButtonProps
} from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

const ColorMode = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const text = useColorModeValue('dark', 'light')
    const SwitchIcon = useColorModeValue(FaMoon, FaSun);

    return (
        <IconButton
        size='md'
        fontSize='lg'
        variant='ghost'
        color='current'
        marginLeft='2'
        onClick={toggleColorMode}
        icon={SwitchIcon()}
        aria-Label={`Switch to ${text} mode`}
        />
    );
  }

export default ColorMode;