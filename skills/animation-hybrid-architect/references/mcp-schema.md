{
  "mcp_server": {
    "name": "web-animation-mcp",
    "version": "2026.05",
    "description": "MCP server exposing Motion and GSAP animation capabilities for AI agents",
    "tools": [
      {
        "name": "select_animation_stack",
        "description": "Recommend Motion, GSAP, or hybrid based on project constraints",
        "parameters": {
          "framework": {"type": "string", "enum": ["react", "vue", "svelte", "vanilla", "webflow", "nextjs"]},
          "animation_complexity": {"type": "string", "enum": ["micro", "ui-transitions", "scroll-story", "cinematic"]},
          "bundle_budget_kb": {"type": "number"},
          "has_scroll_storytelling": {"type": "boolean"},
          "has_svg_morphing": {"type": "boolean"},
          "target_platform": {"type": "string", "enum": ["mobile", "web", "both"]}
        }
      },
      {
        "name": "generate_motion_component",
        "description": "Generate Motion JSX/Vue component with variants, gestures, and accessibility",
        "parameters": {
          "component_type": {"type": "string", "enum": ["modal", "drawer", "list", "card", "page-transition", "gesture"]},
          "animation_states": {"type": "array", "items": {"type": "string"}},
          "gestures": {"type": "array", "items": {"type": "string", "enum": ["drag", "tap", "hover", "pan", "none"]}},
          "layout_animation": {"type": "boolean"},
          "exit_animation": {"type": "boolean"},
          "reduced_motion_support": {"type": "boolean", "default": true}
        }
      },
      {
        "name": "generate_gsap_timeline",
        "description": "Generate GSAP timeline with plugin registration and cleanup",
        "parameters": {
          "trigger_type": {"type": "string", "enum": ["scroll", "time", "event"]},
          "plugins": {"type": "array", "items": {"type": "string", "enum": ["ScrollTrigger", "SplitText", "MorphSVG", "DrawSVG", "MotionPath", "Flip", "ScrollSmoother"]}},
          "sequence": {"type": "array"},
          "pin": {"type": "boolean"},
          "scrub": {"type": "boolean"},
          "cleanup_required": {"type": "boolean", "default": true}
        }
      },
      {
        "name": "audit_animation_bundle",
        "description": "Audit animation bundle size and suggest optimizations",
        "parameters": {
          "libraries": {"type": "array", "items": {"type": "string", "enum": ["motion", "gsap"]}},
          "features_used": {"type": "array", "items": {"type": "string"}},
          "target_budget_kb": {"type": "number"},
          "platform": {"type": "string", "enum": ["mobile", "web"]}
        }
      },
      {
        "name": "create_hybrid_protocol",
        "description": "Create shared hooks, cleanup, and boundary rules for Motion+GSAP projects",
        "parameters": {
          "framework": {"type": "string", "enum": ["react", "vue", "nextjs"]},
          "motion_scope": {"type": "array", "items": {"type": "string"}},
          "gsap_scope": {"type": "array", "items": {"type": "string"}},
          "has_smooth_scroll": {"type": "boolean"}
        }
      }
    ]
  }
}