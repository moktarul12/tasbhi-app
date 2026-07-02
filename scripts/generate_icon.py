#!/usr/bin/env python3
"""Generate app icon PNG using pure Python (zlib + struct)."""
import zlib
import struct
import math
import os

W, H = 1024, 1024

def make_png(pixels, width, height):
    def chunk(ctype, data):
        c = ctype + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)
    
    raw = b''
    for y in range(height):
        raw += b'\x00'  # filter type 0
        for x in range(width):
            idx = (y * width + x) * 4
            raw += bytes(pixels[idx:idx+4])
    
    return (b'\x89PNG\r\n\x1a\n' +
            chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)) +
            chunk(b'IDAT', zlib.compress(raw, 9)) +
            chunk(b'IEND', b''))

def lerp(a, b, t):
    return a + (b - a) * t

def lerp_color(c1, c2, t):
    return tuple(int(lerp(c1[i], c2[i], t)) for i in range(3))

def draw_circle(pixels, cx, cy, r, color, width=W):
    for y in range(max(0, int(cy-r-2)), min(H, int(cy+r+2))):
        for x in range(max(0, int(cx-r-2)), min(width, int(cx+r+2))):
            d = math.sqrt((x-cx)**2 + (y-cy)**2)
            if d <= r:
                idx = (y * width + x) * 4
                alpha = min(1.0, (r - d) / 1.5) if d > r - 1.5 else 1.0
                for i in range(3):
                    pixels[idx+i] = int(color[i] * alpha + pixels[idx+i] * (1-alpha))
                pixels[idx+3] = 255

def draw_ring(pixels, cx, cy, r, thickness, color):
    for y in range(max(0, int(cy-r-thickness)), min(H, int(cy+r+thickness))):
        for x in range(max(0, int(cx-r-thickness)), min(W, int(cx+r+thickness))):
            d = math.sqrt((x-cx)**2 + (y-cy)**2)
            if r-thickness <= d <= r:
                idx = (y * W + x) * 4
                pixels[idx] = color[0]
                pixels[idx+1] = color[1]
                pixels[idx+2] = color[2]
                pixels[idx+3] = 255

# Colors
BG_TOP = (30, 80, 100)      # deep teal
BG_BOTTOM = (15, 45, 65)    # dark blue
GOLD = (212, 175, 55)       # gold
GOLD_LIGHT = (230, 200, 100)
WHITE = (255, 255, 255)
CREAM = (250, 245, 230)
GREEN = (74, 144, 74)

pixels = bytearray(W * H * 4)

# Gradient background (radial from center)
cx, cy = W // 2, H // 2
max_dist = math.sqrt(cx**2 + cy**2)
for y in range(H):
    for x in range(W):
        dist = math.sqrt((x - cx)**2 + (y - cy)**2)
        t = dist / max_dist
        t = min(1.0, t * 1.3)
        col = lerp_color(BG_TOP, BG_BOTTOM, t)
        idx = (y * W + x) * 4
        pixels[idx] = col[0]
        pixels[idx+1] = col[1]
        pixels[idx+2] = col[2]
        pixels[idx+3] = 255

# Outer decorative ring
draw_ring(pixels, cx, cy, 380, 4, GOLD)

# Inner ring
draw_ring(pixels, cx, cy, 340, 2, GOLD_LIGHT)

# Tasbih beads in a circle
num_beads = 33
bead_r = 28
bead_ring_r = 300
for i in range(num_beads):
    angle = (i / num_beads) * 2 * math.pi - math.pi / 2
    bx = cx + bead_ring_r * math.cos(angle)
    by = cy + bead_ring_r * math.sin(angle)
    # Larger beads at cardinal points
    br = bead_r + 6 if i % 11 == 0 else bead_r
    color = GOLD if i % 11 == 0 else GOLD_LIGHT
    draw_circle(pixels, bx, by, br, color)
    # Inner highlight
    draw_circle(pixels, bx - br*0.3, by - br*0.3, br * 0.4, (255, 250, 230))

# Center tawaf stone (larger bead)
draw_circle(pixels, cx, cy, 70, GOLD)
draw_circle(pixels, cx, cy, 60, GOLD_LIGHT)
draw_circle(pixels, cx - 18, cy - 18, 25, (255, 250, 230))

# Crescent moon above center
moon_cx = cx
moon_cy = cy - 130
draw_circle(pixels, moon_cx, moon_cy, 45, CREAM)
draw_circle(pixels, moon_cx + 18, moon_cy - 8, 38, (15, 45, 65))  # cutout using bg color

# Small star below
star_cx, star_cy = cx, cy + 130
draw_circle(pixels, star_cx, star_cy, 8, GOLD_LIGHT)
for angle_deg in [0, 45, 90, 135, 180, 225, 270, 315]:
    a = math.radians(angle_deg)
    draw_circle(pixels, star_cx + 16*math.cos(a), star_cy + 16*math.sin(a), 3, GOLD_LIGHT)

# Generate main icon
png_data = make_png(pixels, W, H)
icon_path = os.path.join(os.path.dirname(__file__), '..', 'assets', 'icon.png')
with open(icon_path, 'wb') as f:
    f.write(png_data)
print(f"Generated {icon_path} ({len(png_data)} bytes)")

# Generate adaptive icon foreground (transparent bg, just the beads)
pixels_fg = bytearray(W * H * 4)
# Transparent background
for i in range(0, len(pixels_fg), 4):
    pixels_fg[i+3] = 0  # alpha = 0

# Draw beads on transparent bg
for i in range(num_beads):
    angle = (i / num_beads) * 2 * math.pi - math.pi / 2
    bx = cx + bead_ring_r * math.cos(angle)
    by = cy + bead_ring_r * math.sin(angle)
    br = bead_r + 6 if i % 11 == 0 else bead_r
    color = GOLD if i % 11 == 0 else GOLD_LIGHT
    draw_circle(pixels_fg, bx, by, br, color)
    draw_circle(pixels_fg, bx - br*0.3, by - br*0.3, br * 0.4, (255, 250, 230))

draw_circle(pixels_fg, cx, cy, 70, GOLD)
draw_circle(pixels_fg, cx, cy, 60, GOLD_LIGHT)
draw_circle(pixels_fg, cx - 18, cy - 18, 25, (255, 250, 230))

# Crescent
draw_circle(pixels_fg, moon_cx, moon_cy, 45, CREAM)
# For transparent bg, we need to "subtract" - just draw the cutout as transparent
for y in range(max(0, int(moon_cy-50)), min(H, int(moon_cy+50))):
    for x in range(max(0, int(moon_cx-50)), min(W, int(moon_cx+50))):
        d1 = math.sqrt((x-moon_cx)**2 + (y-moon_cy)**2)
        d2 = math.sqrt((x-(moon_cx+18))**2 + (y-(moon_cy-8))**2)
        if d1 <= 45 and d2 <= 38:
            idx = (y * W + x) * 4
            pixels_fg[idx] = 0
            pixels_fg[idx+1] = 0
            pixels_fg[idx+2] = 0
            pixels_fg[idx+3] = 0

png_fg = make_png(pixels_fg, W, H)
fg_path = os.path.join(os.path.dirname(__file__), '..', 'assets', 'android-icon-foreground.png')
with open(fg_path, 'wb') as f:
    f.write(png_fg)
print(f"Generated {fg_path} ({len(png_fg)} bytes)")

# Generate favicon (smaller, 128x128)
pixels_small = bytearray(128 * 128 * 4)
scale = 128 / W
for y in range(128):
    for x in range(128):
        sx = int(x / scale)
        sy = int(y / scale)
        si = (sy * W + sx) * 4
        di = (y * 128 + x) * 4
        pixels_small[di] = pixels[si]
        pixels_small[di+1] = pixels[si+1]
        pixels_small[di+2] = pixels[si+2]
        pixels_small[di+3] = pixels[si+3]

png_fav = make_png(pixels_small, 128, 128)
fav_path = os.path.join(os.path.dirname(__file__), '..', 'assets', 'favicon.png')
with open(fav_path, 'wb') as f:
    f.write(png_fav)
print(f"Generated {fav_path} ({len(png_fav)} bytes)")

# Generate splash icon (200x200)
pixels_splash = bytearray(200 * 200 * 4)
scale_s = 200 / W
for y in range(200):
    for x in range(200):
        sx = int(x / scale_s)
        sy = int(y / scale_s)
        si = (sy * W + sx) * 4
        di = (y * 200 + x) * 4
        pixels_splash[di] = pixels[si]
        pixels_splash[di+1] = pixels[si+1]
        pixels_splash[di+2] = pixels[si+2]
        pixels_splash[di+3] = pixels[si+3]

png_splash = make_png(pixels_splash, 200, 200)
splash_path = os.path.join(os.path.dirname(__file__), '..', 'assets', 'splash-icon.png')
with open(splash_path, 'wb') as f:
    f.write(png_splash)
print(f"Generated {splash_path} ({len(png_splash)} bytes)")

print("All icons generated!")
