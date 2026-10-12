import base64
import os

repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
f407_path = os.path.join(repo_root, 'configurator', 'firmware', 'metisa_stm32f407_firmware.bin')
f401_path = os.path.join(repo_root, 'configurator', 'firmware', 'metisa_stm32_firmware.bin')
out_path = os.path.join(repo_root, 'configurator', 'firmware', 'embedded_stm32_bin.js')

with open(f407_path, 'rb') as f:
    b64_f407 = base64.b64encode(f.read()).decode('ascii')

with open(f401_path, 'rb') as f:
    b64_f401 = base64.b64encode(f.read()).decode('ascii')

content = f'''// Auto-generated bundled STM32 binaries for Metisa Suite Web Flasher
window.METISA_BUNDLED_STM32F407_BIN_B64 = "{b64_f407}";
window.METISA_BUNDLED_STM32F401_BIN_B64 = "{b64_f401}";
'''

with open(out_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Generated {out_path} successfully. F407: {len(b64_f407)} chars, F401: {len(b64_f401)} chars")
