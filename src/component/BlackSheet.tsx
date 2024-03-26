import { styled } from '@mui/joy/styles';

const BlackSheet = styled('div', { name: 'BlackSheet' })({
  position: 'relative',
  zIndex: 1,
  width: '100%',
  borderTopRightRadius: '24px',
  backgroundColor: '#00000088',
  '&::before, &::after': {
    content: '""',
    display: 'block',
    position: 'absolute',
    left: '-5px',
    zIndex: -1,
    borderColor: '#ffffff55',
    borderStyle: 'solid'
  },
  '&::before': {
    top: '5px',
    width: '5px',
    height: '100%',
    borderWidth: '1px 0 0 1px'
  },
  '&::after': {
    bottom: '-5px',
    width: '100%',
    height: '5px',
    borderWidth: '0 1px 1px 0'
  }
});

export default BlackSheet;
