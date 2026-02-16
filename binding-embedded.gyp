{
  "targets": [
    {
      "target_name": "ksef-pdf-generator",
      "type": "shared_library",
      "sources": [
        "src/addon/ksef-pdf-generator-embedded.cpp"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "defines": [
        "NAPI_DISABLE_CPP_EXCEPTIONS",
        "NAPI_VERSION=8"
      ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "conditions": [
        ["OS=='win'", {
          "msvs_settings": {
            "VCCLCompilerTool": {
              "ExceptionHandling": 1,
              "AdditionalOptions": ["/EHsc", "/std:c++17"],
              "RuntimeLibrary": 2,
            }
          },
          "configurations": {
            "Release": {
              "msvs_settings": {
                "VCCLCompilerTool": {
                  "RuntimeLibrary": 2
                }
              }
            }
          },
          "defines": [
            "_WINDLL",
            "_USRDLL"
          ]
        }]
      ],
      "link_settings": {
        "libraries": []
      }
    }
  ]
}

