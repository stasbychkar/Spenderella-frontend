"use client"

import { useState, useEffect } from "react"
import { Check, Loader2, User, Building2, BarChart3 } from 'lucide-react'
import Image from "next/image"
import "./demo-loading.css"

interface LoadingStep {
  id: number
  text: string
  icon: React.ComponentType<{ className?: string }>
  status: "pending" | "loading" | "complete"
}

interface DemoLoadingProps {
  onFinish: () => void
}

export function DemoLoading({ onFinish }: DemoLoadingProps) {
  const [steps, setSteps] = useState<LoadingStep[]>([
    {
      id: 1,
      text: "Creating a demo user...",
      icon: User,
      status: "loading",
    },
    {
      id: 2,
      text: "Connecting test bank accounts...",
      icon: Building2,
      status: "pending",
    },
    {
      id: 3,
      text: "Launching your dashboard...",
      icon: BarChart3,
      status: "pending",
    },
  ])

  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        const nextStep = prev + 1

        // Update steps state
        setSteps((prevSteps) =>
          prevSteps.map((step, index) => {
            if (index < nextStep) {
              return { ...step, status: "complete" }
            } else if (index === nextStep) {
              return { ...step, status: "loading" }
            } else {
              return { ...step, status: "pending" }
            }
          }),
        )

        if (nextStep >= 3) {
          setTimeout(() => {
            onFinish()
          }, 800)
          clearInterval(timer)
          return nextStep
        }

        return nextStep
      })
    }, 1200)

    return () => clearInterval(timer)
  }, [onFinish])

  return (
    <div className="demo-loading-overlay">
      {/* Background with glassmorphism effect */}
      <div className="demo-loading-background" />

      {/* Floating orbs for ambiance */}
      <div className="demo-loading-orbs">
        <div className="demo-loading-orb-1" />
        <div className="demo-loading-orb-2" />
      </div>

      {/* Main loading card */}
      <div className="demo-loading-container">
        <div className="demo-loading-card">
          {/* Header */}
          <div className="demo-loading-header">
            <h2 className="demo-loading-subtitle">Setting up your demo</h2>
            <p className="demo-loading-description">This will only take a moment...</p>
          </div>

          {/* Loading steps */}
          <div className="demo-loading-steps">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={step.id}
                  className={`demo-loading-step ${step.status}`}
                >
                  {/* Icon/Status indicator */}
                  <div className={`demo-loading-step-icon ${step.status}`}>
                    {step.status === "loading" ? (
                      <Loader2 className="demo-loading-spinner" />
                    ) : step.status === "complete" ? (
                      <Check className="demo-loading-check-animation" />
                    ) : (
                      <Icon />
                    )}
                  </div>

                  {/* Step text */}
                  <div className={`demo-loading-step-text ${step.status}`}>
                    <p>{step.text}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Progress bar */}
          <div className="demo-loading-progress">
            <div className="demo-loading-progress-header">
              <span>Progress</span>
              <span>{Math.round(((currentStep) / 3) * 100)}%</span>
            </div>
            <div className="demo-loading-progress-bar-container">
              <div
                className="demo-loading-progress-bar"
                style={{
                  width: `${((currentStep) / 3) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
