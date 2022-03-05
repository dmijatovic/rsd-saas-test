import {useState} from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'

import {MenuItemType} from '../../config/menuItems'
import router from 'next/router'

type UserMenuType={
  name:string,
  image?:string
  menuOptions?:MenuItemType[]
}

export default function UserMenu(props:UserMenuType) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const {name, image, menuOptions} = props

  function handleClick(event: React.MouseEvent<HTMLButtonElement>){
    setAnchorEl(event.currentTarget)
  }

  function handleClose(item:MenuItemType){
    if (item?.fn){
      // call function if provided
      item.fn(item)
    } else if (item?.path){
      // push to route if provided
      router.push(item.path)
    }
    setAnchorEl(null)
  }

  function renderMenuOptions(){
    if (menuOptions){
      return (
        menuOptions.map(item=>{
          return (
            <MenuItem
              data-testid="user-menu-option"
              key={item.label}
              onClick={()=>handleClose(item)}>
              {item.label}
            </MenuItem>
          )
        })
      )
    }
  }

  return (
    <>
      <IconButton
        data-testid="user-menu-button"
        aria-controls="user-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : 'false'}
        onClick={handleClick}
      >
        <Avatar
          alt={name ?? 'Unknown'}
          src={image}
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'menu-button',
        }}
        transformOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
      >
        {renderMenuOptions()}
      </Menu>
    </>
  )
}
