# Auth sessions (refresh token + devices)

Backend endi har bir login uchun `user_devices` jadvalida alohida sessiya (device) yaratadi va refresh tokenni serverda **hash** holatda saqlaydi.

## Response (login/register)

`POST /auth/register` va `POST /auth/login`:

- `token`: JWT access token (payload ichida `deviceId` bor)
- `refreshToken`: random string (client saqlaydi)
- `device`: device row
- `user`: user info

Device info uchun ixtiyoriy headerlar:

- `x-platform`: masalan `web`, `ios`, `android`
- `x-device-name`: masalan `Chrome on Windows`

## Refresh (token rotation)

`POST /auth/refresh`

Body:

```json
{ "refreshToken": "..." }
```

Natija: yangi `token` + yangi `refreshToken` qaytadi (old refresh token endi ishlamaydi).

## Devices (kick / revoke)

`GET /auth/devices` — current user’ning device’lari ro‘yxati.

`POST /auth/devices/:id/revoke` — shu device’ni revoke qiladi.

`POST /auth/logout` — current device’ni revoke qiladi.

Revoke qilingan device access tokeni darhol ishlamay qoladi (keyingi requestlarda `401`).

