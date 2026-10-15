import urllib.request

with open('public/samples/fundus_pm_severe.png', 'rb') as f:
    img_bytes = f.read()

boundary = 'boundary123'
header = f'--{boundary}\r\nContent-Disposition: form-data; name="image"; filename="fundus.png"\r\nContent-Type: image/png\r\n\r\n'.encode()
footer = f'\r\n--{boundary}--\r\n'.encode()
body = header + img_bytes + footer

req = urllib.request.Request(
    'https://pathmyopia.onrender.com/analyze',
    data=body,
    headers={
        'Content-Type': f'multipart/form-data; boundary={boundary}',
        'Origin': 'https://retinovaa.netlify.app'
    }
)

try:
    with urllib.request.urlopen(req, timeout=25) as res:
        print('Status:', res.status)
        print('Response:', res.read().decode())
except urllib.error.HTTPError as e:
    print('HTTPError:', e.code, e.read().decode())
except Exception as e:
    print('Error:', e)
