import network   #import des fonction lier au wifi
import urequests    #import des fonction lier au requetes http
import utime    #import des fonction lier au temps
import ujson    #import des fonction lier aà la convertion en Json
from machine import Pin, PWM
pins = [0, 1, 2][::-1] # Red, Green, Blue
leds = []
for i in pins:
    leds.append(PWM(Pin(i, mode=Pin.OUT)))
    
for i in leds:
    i.freq(1000)
    i.duty_u16(0)
    
def setColor(HEX_COLOR):
    RGB_VALUES = [HEX_COLOR[i:i+2] for i in range(0, len(HEX_COLOR), 2)]
    led_number = 0
    for value in RGB_VALUES:
        decimal_value = int(value, 16)
        leds[led_number].duty_u16(decimal_value * 256)
        led_number += 1
wlan = network.WLAN(network.STA_IF) # met la raspi en mode client wifi
wlan.active(True) # active le mode client wifi

# -------------------------------------------------------------------------
ssid = 'WIFI_SSID_HERE'
password = 'WIFI_PASSWORD_HERE'
# -------------------------------------------------------------------------

wlan.connect(ssid, password) # connecte la raspi au réseau
url = "https://hp.lyenx.com/api/"
while not wlan.isconnected():
    setColor("100000")
    utime.sleep(0.5)
    setColor("000000")
    utime.sleep(0.5)
    pass
houseColors = {
    "gryffindor": "FF0000",
    "hufflepuff": "FFFF00",
    "ravenclaw": "0000FF",
    "slytherin": "00FF00",
    "": "101010",
    "no-house": "101010",
    None: "101010"
}
try:
    print("If there is an authentication error, the word 'token' will be printed out")
    EMAIL = str(input("E-mail adress : "))
    PASSWORD = str(input("Password : "))
    r = urequests.post(url + "login",
    data=ujson.dumps({
        "email": EMAIL,
        "password": PASSWORD
    }),
    headers={
        "Content-Type": "application/json"
    })
    print("===== SESSION WILL EXPIRE IN 30 MINUTES =====")
    token = r.json()['token']
    r.close()
    
    while True:
        r = urequests.get(url + "latesthouse",
        headers={
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        })
        profile = r.json()
        r.close()
        house = profile['house']
        setColor(houseColors[house])
except Exception as e:
    print(e)